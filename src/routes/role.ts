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
import { verifyAuthorization } from '../utils/middlewares/validation';

// Import Model
import { FilterModel } from '../models/filter';
import { RoleModel } from '../models/role';
import { IRole, nameTable } from "../interfaces/role";

/** Class for Role */
export class RoleRoutes extends RouteBase<IRole> {
  private roleService: RoleService;

  /** Constructor  */
  constructor() {
    super(
      Router(),
      '/api/v0/roles/',
      nameTable,
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
    this.create();
    this.update();
    this.delete();
    this.filter();
    this.createReferenceModule();
    this.updateReferenceModule();
    this.deleteReferenceModule();
  }

  /** Create reference of Module  */
  private createReferenceModule() {
    this.router.post(
      '/:id/modules/',
      validationHandler({ id: this.model.getIdSchema() }, 'params'),
      validationHandler((new RoleModel).getRoleModule()),
      verifyAuthorization('permission', 'create'),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = await this.roleService.createModuleReference(
            req.body,
            req.params.id
          );
          res.status(201).send(data);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  /** Update Reference of Module into Role  */
  private updateReferenceModule() {
    this.router.patch(
      '/:idRole/modules/:idModule',
      validationHandler({
        idRole: this.model.getIdSchema(),
        idModule: this.model.getIdSchema()
      }, 'params'),
      validationHandler((new RoleModel).getRoleModule()),
      verifyAuthorization('permission', 'update'),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = await this.roleService.updateModuleReference(
            req.body,
            req.params.idRole,
            req.params.idModule
          );
          res.status(200).send(data);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  /** Delete Reference of Module into Role  */
  private deleteReferenceModule() {
    this.router.delete(
      '/:idRole/modules/:idModule',
      validationHandler({
        idRole: this.model.getIdSchema(),
        idModule: this.model.getIdSchema()
      }, 'params'),
      verifyAuthorization('permission', 'delete'),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = await this.roleService.deleteModuleReference(
            req.params.idRole,
            req.params.idModule
          );
          res.status(200).send(data);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  // End Class Route
}
