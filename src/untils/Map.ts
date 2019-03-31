class EMap<K,V>{
    private _map = new Map<K,V>();
    public set(key:K,value:V){
        this._map.set(key,value);
    }
    public delete(key:K){
        this._map.delete(key);
    }
    public clone(){
        let _clone = new EMap<K,V>();
        this._map.forEach((value:any,key:any)=>{
            _clone.set(key,value);
        });
        return _clone;
    }
    public forEach(callbackfn: (value: V, key: K, map: Map<K, V>) => void, thisArg?: any){
        this._map.forEach(callbackfn,thisArg);
    }
    public toArray(){
        let arr:V[]=[];
        this._map.forEach((value:V,key:K)=>{
            arr.push(value);
        });
        return arr;
    }
    public last(){
        return this.toArray().pop();
    }
    public first(){
        return this.toArray().shift();
    }
    public get size(){
        return this._map.size;
    }
    public has(key:K){
        return this._map.has(key);
    }
    public get(key:K){
        return this._map.get(key);
    }
}

export {EMap};