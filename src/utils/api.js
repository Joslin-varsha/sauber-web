const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://saubernfix-ww3jcjkv7a-nw.a.run.app';

export async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (typeof window !== 'undefined') {
    const token = sessionStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    const textText = await response.text();
    const cleanText = textText.replace(/<[^>]*>/g, '').trim().slice(0, 100);
    throw new Error(cleanText || `Request failed with status ${response.status}`);
  }
  
  if (!response.ok || data.status === false) {
    throw new Error(data.message || 'Something went wrong');
  }

  return data;
}

export const authApi = {
  register: (fullName, email, phone) => 
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, phone })
    }),
    
  login: (email) => 
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),
    
  verifyOtp: (email, otp) => 
    request('/api/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp })
    }),

  getProfile: () =>
    request('/api/profile', {
      method: 'GET'
    }),

  updateProfile: (name, location) =>
    request('/api/profile/update', {
      method: 'POST',
      body: JSON.stringify({ name, location })
    }),

  createOrder: (payload) =>
    request('/api/order/create', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  addExtraHours: (booking_id, extraHours) =>
    request('/api/order/add-extra-hours', {
      method: 'POST',
      body: JSON.stringify({ booking_id, extra_hours: extraHours })
    }),

  getOrderDetails: (bookingId) =>
    request('/api/orders/details', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId })
    }),

  submitReview: (bookingId, orderId, rating, feedback) =>
    request('/api/reviews/add', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, order_id: orderId, rating, feedback })
    }),

  getOrders: (status) => {
    const payload = {};
    if (status && status !== 'All Orders' && status !== 'All Status') {
      payload.status = status.toLowerCase().replace(' ', '');
    }
    return request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  },

  getWorkers: (filters = {}) =>
    request('/api/workers/list', {
      method: 'POST',
      body: JSON.stringify(filters)
    }),

  rescheduleOrder: (bookingId, workerId) =>
    request('/api/order/reschedule', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId, worker_id: workerId })
    }),

  getHomeData: () =>
    request('/api/home', {
      method: 'GET'
    }),

  getServicesDropdown: () =>
    request('/api/services/dropdown', {
      method: 'GET'
    }),

  getWorkerDetails: (workerId) =>
    request(`/api/worker/details/${workerId}`, {
      method: 'GET'
    }),

  getPricingSettings: () =>
    request('/api/service/pricing-settings', {
      method: 'GET'
    }),

  getServiceMaterials: (serviceId) =>
    request('/api/service/materials', {
      method: 'POST',
      body: JSON.stringify({ service_id: serviceId })
    }),
};

