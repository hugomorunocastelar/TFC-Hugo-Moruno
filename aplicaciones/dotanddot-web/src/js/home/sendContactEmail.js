import API from "../env.js";
import * as http from "../http.js";

export async function sendContactEmail(name, email, message) {
  try {
    const response = await http.post(API.CONTACT.SEND, {
      name: name,
      email: email,
      message: message
    });
    if (!response.ok) {
      throw new Error('Contact email send failed');
    }
    return response.json();
  } catch (error) {
    console.error('Contact email error:', error);
    return false;
  }
}
