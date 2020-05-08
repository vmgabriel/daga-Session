
// Develop vmgabriel

// Libraries
import { Router, Request, Response, NextFunction } from "express";

// Abstract Service
import { AbstractService } from '../services/abstract';
import { AbstractModel } from '../models/abstract';

// Validators
import { validationHandler } from '../utils/validations/menuHandler';

/** Router base Initial Configuration  */
export abstract class RouteBase {

  /**
   * Get Data Express Router and Uri
   * @param router Express Router defined for routes
   * @param uri route base
   */
  constructor(
    public router: Router,
    public uri: string,
    private model?: AbstractModel,
    private service?: AbstractService
  ) {}

  protected abstract config(): void;

  /** Route of get All data */
  protected getall() {
    this.router.get('', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.getAll();
        res.status(200).send(data);
      } catch(err) {
        next(err);
      }
    });
  }

  /** Route of Get One data By Id  */
  protected getOne() {
    this.router.get(
      '/:id',
      validationHandler({ id: this.model.getIdSchema() }, 'params'),
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.getOne(req.params.id);
        res.status(200).send(data);
      } catch(err) {
        next(err);
      }
    });
  }

  /** Route of Post Filter Data By Content Filter  */
  protected filter() {
    this.router.post('/filter', async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.filter(req.body.attributes, req.body.filter);
        res.status(200).send(data);
      } catch(err) {
        next(err);
      }
    });
  }

  /** Rooute of Post Create Register with data  */
  protected create() {
    this.router.post(
      '',
      validationHandler(this.model.getCreateScheme()),
      async (req: Request, res: Response, next: NextFunction) => {
        try {
          const data = await this.service.create(req.body);
          res.status(201).send(data);
        } catch(err) {
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
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.update(req.params.id, req.body);
        res.status(200).send(data);
      } catch(err) {
        next(err);
      }
    });
  }

  /** Rpute of Delete Register with id Defiened  */
  protected delete() {
    this.router.delete(
      '/:id',
      validationHandler({ id: this.model.getIdSchema() }, 'params'),
      async (req: Request, res: Response, next: NextFunction) => {
      try {
        const data = await this.service.delete(req.params.id);
        res.status(200).send(data);
      } catch(err) {
        next(err);
      }
    });
  }
  // End Class
}
