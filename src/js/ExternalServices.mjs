const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  // Always try to parse the response as JSON first
  const jsonResponse = await res.json();
  
  if (res.ok) {
    return jsonResponse;
  } else {
    // Throw detailed error with server response
    throw { 
      name: 'servicesError', 
      message: jsonResponse,
      status: res.status,
      statusText: res.statusText
    };
  }
}

export default class ExternalServices {
  constructor() {
    // Constructor is empty - no category or path needed
  }

  async getData(category) {
    try {
      const response = await fetch(`${baseURL}products/search/${category}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error('Error fetching product data:', error);
      throw error;
    }
  }

  async findProductById(id) {
    try {
      const response = await fetch(`${baseURL}product/${id}`);
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      throw error;
    }
  }

  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    };
    
    console.log('Sending checkout request to:', `${baseURL}checkout`);
    console.log('Payload:', payload);
    
    try {
      const response = await fetch(`${baseURL}checkout`, options);
      const data = await convertToJson(response);
      console.log('Checkout successful:', data);
      return data;
    } catch (error) {
      console.error('Checkout failed:', error);
      throw error;
    }
  }
}