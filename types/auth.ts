export interface AuthResult {
  success: boolean;
  uid?: string;
  email?: string;
  error?: string;
  statusCode?: number;
}
