class EventEmitter{
  constructor(num=10){
    this.maxListeners=num;
    this.events=Object.create(null);
  }
}
