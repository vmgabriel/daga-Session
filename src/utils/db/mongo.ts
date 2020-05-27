// Develop vmgabriel

// Libraries
import * as mongoose from 'mongoose';

// Enviroment
import config from '../../config';

/** Mongo Connect to Database  */
class MongoConnection {
  private hostConnect: string;
  private portConnect: string;
  private username: string;
  private password: string;

  public isConnected: boolean;

  constructor() {
    this.hostConnect = config.hostDb;
    this.portConnect = config.portDb;
    this.username = config.userDb;
    this.password = config.passDb;

    this.isConnected = true;
  }

  /** Connect Mongo */
  public async mongoConnect() {
    try {
      mongoose.set('useFindAndModify', false);
      mongoose.set('debug', true);

      const instance = await mongoose.connect(this.getRoute(), {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });

      console.dir('Succesfully Connected to Database.');
      this.isConnected = true;
      return instance;
    } catch (err) {
      console.error('Unable to Connect to the Database');
      throw(err);
    }
  }

  /** Disconnect to database  */
  public disconnect(): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
      if (this.isConnected) {
        this.isConnected = false;
        mongoose.disconnect((err: any) => {
          if (err) {
            this.isConnected = true;
            reject(err);
          }

          console.log('Database Disconnection Sucess');
          resolve();
        });
      } else {
        return 'no database connection active';
      }
    });
  }

  /** get Name of Database, change if dev change */
  public getNameDb(): string {
    let dbName: string;
    switch (config.dev.toLowerCase()) {
      case 'production':
        dbName = config.nameDocProd;
        break;
      case 'dev':
      case 'develop':
      case 'development':
        dbName = config.nameDocDev;
        break;
      case 'test':
      case 'testing':
        dbName = config.nameDocTest;
        break;
      default:
        dbName = config.nameDocProd;
        break;
    }
    return dbName;
  }

  /** Get Route  */
  private getRoute(): string {
    let route = '';
    route += 'mongodb://';
    if (
      (!!this.username && this.username != '') &&
        (!!this.password && this.password != '')
    ) {
      route += this.username;
      route += ':';
      route += this.password;
      route += '@';
    }
    route += this.hostConnect;
    route += ':'
    route += this.portConnect;
    route += '/';
    route += this.getNameDb();
    route += `?authSource=${this.getNameDb()}&w=1`;
    return route;
  }

  // End Class
}

const mongoConnection = new MongoConnection();
export default mongoConnection;
