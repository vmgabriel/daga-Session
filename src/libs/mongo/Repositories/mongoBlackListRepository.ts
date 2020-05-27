// Develop vmgabriel

// Connection
import { MongoLib } from '../../mongolib';

// Models
import { BlackListModel } from '../../../models/blacklist';

// interfaces
import { IBlackList, nameTable, stateName } from '../../../interfaces/blacklist';

// - Repositories
import { BlackListRepo } from '../../../interfaces/repositories/blacklistRepo';

/** Repository of BlaackList Mongo Repository  */
export class BlackListMongoRepository extends MongoLib<IBlackList> implements BlackListRepo {
  constructor() {
    super(nameTable, stateName, new BlackListModel());
  }

  // End Class
}
