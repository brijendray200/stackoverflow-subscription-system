let token = localStorage.getItem('token');
const API_URL = window.location.origin + '/api';

function showMessage(elementId, message, isError = false) {
  const el = document.getElementById(elementId);
  el.innerHTML = `<p class="${isError ? 'error' : 'success'}">${message}</p>`;
  setTimeout(() => el.innerHTML = '', 5000);
}

function showTab(tab) {
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const tabs = document.querySelectorAll('.tab-btn');
  
  tabs.forEach(t => t.classList.remove('active'));
  
  if (tab === 'login') {
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
    tabs[0].classList.add('active');
  } else {
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
    tabs[1].classList.add('active');
  }
}

async function register() {
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      showMessage('authMessage', 'Registration successful!');
      loadDashboard();
    } else {
      showMessage('authMessage', data.error, true);
    }
  } catch (error) {
    showMessage('authMessage', 'Error: ' + error.message, true);
  }
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (res.ok) {
      token = data.token;
      localStorage.setItem('token', token);
      showMessage('authMessage', 'Login successful!');
      loadDashboard();
    } else {
      showMessage('authMessage', data.error, true);
    }
  } catch (error) {
    showMessage('authMessage', 'Error: ' + error.message, true);
  }
}

function logout() {
  localStorage.removeItem('token');
  token = null;
  document.getElementById('authSection').classList.remove('hidden');
  document.getElementById('dashboardSection').classList.add('hidden');
}

async function loadDashboard() {
  document.getElementById('authSection').classList.add('hidden');
  document.getElementById('dashboardSection').classList.remove('hidden');

  try {
    const res = await fetch(`${API_URL}/questions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      document.getElementById('userEmail').textContent = 'User';
      document.getElementById('userPlan').textContent = data.plan.toUpperCase();
      document.getElementById('questionsToday').textContent = 
        `${data.questionsToday} / ${data.limit === Infinity ? 'Unlimited' : data.limit}`;
      
      loadPlans();
      displayQuestions(data.questions);
    }
  } catch (error) {
    console.error('Error loading dashboard:', error);
  }
}

async function loadPlans() {
  try {
    const res = await fetch(`${API_URL}/subscription/plans`);
    const plans = await res.json();

    const container = document.getElementById('plansContainer');
    container.innerHTML = '';

    Object.keys(plans).forEach(key => {
      const plan = plans[key];
      if (key === 'free') return;

      const card = document.createElement('div');
      card.className = `plan-card ${key}`;
      card.innerHTML = `
        <h3>${plan.name}</h3>
        <div class="price">${plan.price}<span class="price-period">/month</span></div>
        <div class="features">
          <li>${plan.questionsPerDay === Infinity ? 'Unlimited' : plan.questionsPerDay} questions per day</li>
          <li>Valid for ${plan.duration} days</li>
          <li>Email invoice included</li>
          <li>Priority support</li>
        </div>
        <button onclick="initiatePayment('${key}', 'razorpay')" style="width: 100%; margin: 5px 0;">💳 Pay with Razorpay</button>
        <button onclick="initiatePayment('${key}', 'stripe')" class="btn-secondary" style="width: 100%; margin: 5px 0;">💳 Pay with Stripe</button>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading plans:', error);
  }
}

async function initiatePayment(plan, gateway) {
  try {
    if (gateway === 'razorpay') {
      const res = await fetch(`${API_URL}/subscription/create-razorpay-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error + '\n' + (data.message || ''));
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount * 100,
        currency: 'INR',
        name: 'StackOverflow Subscription',
        description: data.plan,
        order_id: data.orderId,
        handler: async function(response) {
          await confirmPayment(plan, response.razorpay_payment_id, 'razorpay');
        }
      };

      const rzp = new Razorpay(options);
      rzp.open();
    } else if (gateway === 'stripe') {
      const res = await fetch(`${API_URL}/subscription/create-stripe-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ plan })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error + '\n' + (data.message || ''));
        return;
      }

      // Initialize Stripe
      const stripe = Stripe(data.publishableKey || 'pk_test_51234567890');
      
      // Create payment form
      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId
      });

      if (error) {
        // For demo, we'll use a simpler approach
        const paymentSuccess = confirm(
          `Stripe Payment\n\nPlan: ${data.plan}\nAmount: ₹${data.amount}\n\nClick OK to simulate successful payment`
        );

        if (paymentSuccess) {
          const transactionId = 'stripe_' + Date.now();
          await confirmPayment(plan, transactionId, 'stripe');
        }
      }
    }
  } catch (error) {
    alert('Payment error: ' + error.message);
  }
}

async function confirmPayment(plan, transactionId, gateway) {
  try {
    const res = await fetch(`${API_URL}/subscription/confirm-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ plan, transactionId, gateway })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      loadDashboard();
    } else {
      alert('Error: ' + data.error);
    }
  } catch (error) {
    alert('Error confirming payment: ' + error.message);
  }
}

async function postQuestion() {
  const title = document.getElementById('questionTitle').value;
  const content = document.getElementById('questionContent').value;
  const tags = document.getElementById('questionTags').value.split(',').map(t => t.trim());

  try {
    const res = await fetch(`${API_URL}/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ title, content, tags })
    });

    const data = await res.json();

    if (res.ok) {
      showMessage('questionMessage', data.message);
      document.getElementById('questionTitle').value = '';
      document.getElementById('questionContent').value = '';
      document.getElementById('questionTags').value = '';
      loadQuestions();
    } else {
      showMessage('questionMessage', data.error + '\n' + (data.message || ''), true);
    }
  } catch (error) {
    showMessage('questionMessage', 'Error: ' + error.message, true);
  }
}

async function loadQuestions() {
  try {
    const res = await fetch(`${API_URL}/questions`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      displayQuestions(data.questions);
      document.getElementById('questionsToday').textContent = 
        `${data.questionsToday} / ${data.limit === Infinity ? 'Unlimited' : data.limit}`;
    }
  } catch (error) {
    console.error('Error loading questions:', error);
  }
}

function displayQuestions(questions) {
  const container = document.getElementById('questionsContainer');
  
  if (!questions || questions.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: #888; padding: 20px;">No questions posted yet. Start by posting your first question!</p>';
    return;
  }

  container.innerHTML = questions.map(q => `
    <div class="question-card">
      <h3>${q.title}</h3>
      <p style="margin: 10px 0; color: #555;">${q.content}</p>
      <div class="tags">
        ${q.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
      </div>
      <div class="meta">Posted: ${new Date(q.createdAt).toLocaleString('en-IN')}</div>
    </div>
  `).join('');
}

if (token) {
  loadDashboard();
}
