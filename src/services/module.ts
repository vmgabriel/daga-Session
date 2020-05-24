// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Model Service
import { ModuleModel } from '../models/module';
import { ModuleMongoRepository } from '../libs/mongo/Repositories/mongoModuleRepository';

/** Module Service  */
export class ModuleService extends AbstractService {
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
