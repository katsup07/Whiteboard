export const fetchWithRetry = async(
    url: string, 
    options: RequestInit = {}, 
    retries = 3, 
    delay = 2000
  ): Promise<Response> => {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (retries <= 1) throw error;
      
      console.log(`Request failed, retrying in ${delay}ms... (${retries-1} retries left)`);
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchWithRetry(url, options, retries - 1, delay * 1.5);
    }
  }