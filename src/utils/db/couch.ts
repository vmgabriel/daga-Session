// Develop vmgabriel

import { Cluster, Bucket, Authenticator } from 'couchbase';

// Enviroment
import config from '../../config';

/** Couch Connect To Database  */
class CouchConnection {
  private hostConnect: string;
  private portConnect: string;
  private username: string;
  private password: string;

  public isConnected: boolean;

  private cluster: Cluster;
  public bucket: Bucket;

  constructor() {
    this.hostConnect = config.hostDb;
    this.portConnect = config.portDb;
    this.username = config.userDb;
    this.password = config.passDb;

    this.cluster = new Cluster(this.getRoute());
    this.cluster.authenticate(this.getPasswordAuth());
    this.bucket = this.cluster.openBucket(this.getNameBucket(), this.errorConnection);
    this.bucket.on('connect', () => {
      console.log('[Database] - Conected Correcly');
      this.isConnected = false;
    });
  }

  /** Initialize data of Constructor  */
  public initialize() {
    console.dir('[Database] - Initiling');
  }

  // public

  /**
   * Management the Error in the Connection
   * @param err The error
   */
  private errorConnection(err: any): void {
    if (err) {
      console.log('Connection Error - ', err);
      this.isConnected = false;
      throw (err);
    }
  }

  /** get Name of Bucket, change if dev change */
  public getNameBucket(): string {
    let bucketName: string;
    switch (config.dev.toLowerCase()) {
      case 'production':
        bucketName = config.nameDocProd;
        break;
      case 'dev':
      case 'develop':
      case 'development':
        bucketName = config.nameDocDev;
        break;
      case 'test':
      case 'testing':
        bucketName = config.nameDocTest;
        break;
      default:
        bucketName = config.nameDocProd;
        break;
    }
    return bucketName;
  }

  /** get Password Auth Method for connect with User and Pass */
  private getPasswordAuth(): Authenticator {
    return {
      username: this.username,
      password: this.password
    } as Authenticator;
  }

  /** Get Route of Db  */
  private getRoute(): string {
    return `http://${this.hostConnect}:${this.portConnect}`;
  }

  // End Class
}

const couchConnection = new CouchConnection();
export default couchConnection;
