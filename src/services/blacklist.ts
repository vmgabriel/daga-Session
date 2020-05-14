// Develop vmgabriel

// Abstract Service
import { AbstractService } from './abstract';

// Models
import { BlackListModel } from '../models/blacklist';

/** Black List Service  */
export class BlackListService extends AbstractService {
  constructor() {
    super('blacklist', new BlackListModel(), 'blackListIsValid');
  }

  // End Class
}
