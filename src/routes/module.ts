// Develop vmgabriel

// Libraries
import { Router } from "express";
// import * as expressValidator from 'express-validator';

// Base router Dependency
import { RouteBase } from './route';

// Import Service
import { ModuleService } from '../services/module';

// Import Model
import { ModuleModel } from '../models/module';
import { IModule, nameTable } from "../interfaces/module";

/** Class for modules */
export class ModuleRoutes extends RouteBase<IModule> {

  /** Constructor  */
  constructor() {
    super(
      Router(),
      '/api/v0/modules/',
      nameTable,
      new ModuleModel(),
      new ModuleService()
    );

    this.config();
  }

  /** Conguration Route  */
  protected config() {
    this.getall();
    this.getOne();
    this.filter();
    this.create();
    this.update();
    this.delete();
  }

  // End Class Route
}
