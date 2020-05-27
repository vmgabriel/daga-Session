// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Models
import { BlackListModel } from '../models/blacklist';
import { BlackListMongoRepository } from '../libs/mongo/Repositories/mongoBlackListRepository';

// Interfaces
import { IBlackList } from '../interfaces/blacklist';

/** Black List Service  */
export class BlackListService extends AbstractService<IBlackList> {
  constructor() {
    super(
      'blacklist',
      new BlackListModel(),
      'blackListIsValid',
      new BlackListMongoRepository()
    );
  }

  // End Class
}
