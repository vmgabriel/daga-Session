// Develop vmgabriel

// Libraries
import { Router, Request, Response, NextFunction } from "express";

// Abstract Service
import { AbstractService } from '../services/abstract';
import { AbstractModel } from '../models/abstract';

// Validators
import { validationHandler } from '../utils/validations/validatorHandler';
import { verifyAuthorization } from '../utils/middlewares/validation';

// Routes
import { FilterModel } from '../models/filter';

/** Router base Initial Configuration  */
export abstract class RouteBase<T> {
  protected filterModel: FilterModel;

  /**
   * Get Data Express Router and Uri
   * @param router Router for Data
   * @param uri Url to Connect
   * @param model Model generated for validata Data
   * @param service Service for connect
   */
  constructor(
    public router: Router,
    public uri: string,
    protected modelName: string,
    protected model?: AbstractModel,
    protected service?: AbstractService<T>,
  ) {
    this.filterModel = new FilterModel();
  }

  /** Configuration of selected routes  */
  protected abstract config(): void;

  /** Route of get All data */
  protected getall() {
    this.router.get(
      '',
      verifyAuthorization(this.modelName, 'show'),
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.getAll();
        res.status(200).send(data);
      } catch (err) {
        next(err);
      }
    });
  }

  /** Route of Get One data By Id  */
  protected getOne() {
    this.router.get(
      '/:id',
      validationHandler({ id: this.model.getIdSchema() }, 'params'),
      verifyAuthorization(this.modelName, 'show'),
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.getOne(req.params.id);
        res.status(200).send(data);
      } catch (err) {
        next(err);
      }
    });
  }

  /** Route of Post Filter Data By Content Filter  */
  protected filter() {
    this.router.post(
      '/filter',
      validationHandler(this.filterModel.getAttributeAndFilter()),
      verifyAuthorization(this.modelName, 'show'),
      async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          const data = await this.service.filter(req.body.attributes, req.body.filters);
          res.status(200).send(data);
        } catch (err) {
          next(err);
        }
      });
  }

  /** Rooute of Post Create Register with data  */
  protected create() {
    this.router.post(
      '',
      validationHandler(this.model.getCreateScheme()),
      verifyAuthorization(this.modelName, 'create'),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = await this.service.create(req.body);
          res.status(201).send(data);
        } catch (err) {
          next(err);
        }
      }
    );
  }

  /** Route of Patch Register With id Defined  */
  protected update() {
    this.router.patch(
      '/:id',
      validationHandler({ id: this.model.getIdSchema() }, 'params'),
      validationHandler(this.model.getUpdateScheme()),
      verifyAuthorization(this.modelName, 'update'),
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.update(req.params.id, req.body);
        res.status(200).send(data);
      } catch (err) {
        next(err);
      }
    });
  }

  /** Rpute of Delete Register with id Defiened  */
  protected delete() {
    this.router.delete(
      '/:id',
      validationHandler({ id: this.model.getIdSchema() }, 'params'),
      verifyAuthorization(this.modelName, 'delete'),
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.delete(req.params.id);
        res.status(200).send(data);
      } catch (err) {
        next(err);
      }
    });
  }
  // End Class
}
