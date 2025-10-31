import { AuthService } from "./modules/auth/services/auth.service.js";

export class ServiceProvider {
  static _authServiceInstance;

  static get authService() {
    if (!this._authServiceInstance)
      this._authServiceInstance = new AuthService();
    return this._authServiceInstance;
  }
}
