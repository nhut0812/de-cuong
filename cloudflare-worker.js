// Cloudflare Worker để xóa file từ Cloudinary
// Deploy tại: https://workers.cloudflare.com/

export default {
  async fetch(request, env) {
    // Chỉ cho phép POST request
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      const { publicId } = await request.json();
      
      if (!publicId) {
        return new Response('Missing publicId', { status: 400 });
      }

      const CLOUD_NAME = 'dydd3mjeo';
      const API_KEY = 'YOUR_API_KEY'; // Lấy từ Cloudinary Dashboard
      const API_SECRET = 'YOUR_API_SECRET'; // Lấy từ Cloudinary Dashboard

      // Tạo signature để xóa file
      const timestamp = Math.floor(Date.now() / 1000);
      const stringToSign = `public_id=${publicId}&timestamp=${timestamp}${API_SECRET}`;
      
      // Hash SHA1
      const encoder = new TextEncoder();
      const data = encoder.encode(stringToSign);
      const hashBuffer = await crypto.subtle.digest('SHA-1', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signature = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      // Gọi Cloudinary API để xóa
      const formData = new FormData();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp);
      formData.append('api_key', API_KEY);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`,
        {
          method: 'POST',
          body: formData
        }
      );

      const result = await response.json();

      return new Response(JSON.stringify(result), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });

    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
};
