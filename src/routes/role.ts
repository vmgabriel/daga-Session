// Develop vmgabriel

// Libraries
import { Router, Request, Response, NextFunction } from "express";

// import * as expressValidator from 'express-validator';

// Base router Dependency
import { RouteBase } from './route';

// Import Service
import { RoleService } from '../services/role';

// Validators
import { validationHandler } from '../utils/validations/validatorHandler';

// Import Model
import { FilterModel } from '../models/filter';
import { RoleModel } from '../models/role';

/** Class for Role */
export class RoleRoutes extends RouteBase {
  private roleService: RoleService;

  /** Constructor  */
  constructor() {
    super(
      Router(),
      '/api/v0/roles/',
      new RoleModel(),
      new RoleService()
    );
    this.roleService = new RoleService();

    this.config();
  }

  /** Conguration Route  */
  protected config() {
    this.getall();
    this.getOne();
    this.getWithContentModule();
    this.create();
    this.update();
    this.delete();
  }

  /** Get With Content Module  */
  private getWithContentModule() {
    this.router.post(
      '/filter',
      validationHandler(this.filterModel.getAttributeAndFilter()),
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const data = await this.roleService.getRoleAndPermissionData(
            req.body.attributes,
            req.body.filters
          );
          res.status(200).send(data);
        } catch (err) {
          next(err);
        }
      });
  }

  // End Class Route
}
