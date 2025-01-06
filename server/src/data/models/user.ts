export class User {
  public _id: string;
  public name?: string;
  public picture?: string;
  public email?: string;
  public createdAt: string;

  constructor(_id: string, name?: string, picture?: string, email?: string) {
    this._id = _id;
    this.name = name;
    this.picture = picture;
    this.email = email;
    this.createdAt = new Date().toISOString();
  }
}
