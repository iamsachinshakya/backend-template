import { AuthRepository } from "./modules/auth/repositories/auth.repository.js";
import { UserRepository } from "./modules/users/repositories/user.repository.js";

export class RepositoryProvider {
  static _userRepositoryInstance;
  static _authRepositoryInstance;

  static get userRepository() {
    if (!this._userRepositoryInstance)
      this._userRepositoryInstance = new UserRepository();
    return this._userRepositoryInstance;
  }

  static get authRepository() {
    if (!this._authRepositoryInstance)
      this._authRepositoryInstance = new AuthRepository();
    return this._authRepositoryInstance;
  }
}
