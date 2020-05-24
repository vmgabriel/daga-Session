// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Models
import { BlackListModel } from '../models/blacklist';
import { BlackListMongoRepository } from '../libs/mongo/Repositories/mongoBlackListRepository';

/** Black List Service  */
export class BlackListService extends AbstractService {
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
