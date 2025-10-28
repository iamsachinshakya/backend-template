import { UserController } from "./modules/users/controllers/user.controller.js";

export class ControllerProvider {
  static _userControllerInstance;

  static get userController() {
    if (!this._userControllerInstance)
      this._userControllerInstance = new UserController();
    return this._userControllerInstance;
  }
}
