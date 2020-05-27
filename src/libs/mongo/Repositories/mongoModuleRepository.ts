// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { ModuleModel } from '../../../models/module';

// interfaces
import { IModule, nameTable, stateName } from '../../../interfaces/module';

// - Repositories
import { ModuleRepo } from '../../../interfaces/repositories/moduleRepo';

/** Module Mongo  */
export class ModuleMongoRepository extends MongoLib<IModule> implements ModuleRepo {
  constructor() {
    super(nameTable, stateName, new ModuleModel());
  }

  // End Class
}
