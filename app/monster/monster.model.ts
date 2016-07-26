export class MonsterModel {

  constructor(public name: string, public power: number, private _id: string) {}

  get id() {
    return this._id;
  }
  getImgUrl() {
    return `public/img/monster/${this.name}.png`;
  }
}
