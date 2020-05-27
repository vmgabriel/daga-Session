// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Model Service
import { ModuleModel } from '../models/module';
import { ModuleMongoRepository } from '../libs/mongo/Repositories/mongoModuleRepository';

// Interfaces
import { IModule } from '../interfaces/module';

/** Module Service  */
export class ModuleService extends AbstractService<IModule> {
  constructor() {
    super(
      'module',
      new ModuleModel(),
      'moduleIsValid',
      new ModuleMongoRepository()
    );
  }

  // End Class
}
