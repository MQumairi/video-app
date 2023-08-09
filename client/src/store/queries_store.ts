import { createContext } from "react";
import { makeObservable, observable, action, toJS } from "mobx";
import { PersistentQueries } from "../api/agent";
import IPersistentQuery from "../models/persistent_query";

class QueriesStore {
  constructor() {
    makeObservable(this);
  }

  // All queries
  @observable queries: IPersistentQuery[] = [];

  @action set_queries = (queries: IPersistentQuery[]) => {
    this.queries = queries;
  };

  @action lookup = async () => {
    let res = await PersistentQueries.list();
    if (res.status !== 200) return;
    this.set_queries(res.data);
  };

  @action query_from_id = (query_id: number): IPersistentQuery | undefined => {
    for (let q of this.queries) {
      if (q.id === query_id) return toJS(q);
    }
  };
}

export default createContext(new QueriesStore());