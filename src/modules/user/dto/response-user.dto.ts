export class ResponseUserDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imagePath: string | null;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, firstName: string, lastName: string, email: string, imagePath: string | null, createdAt: Date, updatedAt: Date) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.imagePath = imagePath;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
