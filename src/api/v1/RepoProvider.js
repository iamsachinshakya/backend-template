import { UserController } from "./modules/users/controllers/user.controller.js";

export class RepoProvider {
  static _userProvider;

  static get userProvider() {
    if (!this._userProvider) this._userProvider = new UserController();
    return this._userProvider;
  }
}
