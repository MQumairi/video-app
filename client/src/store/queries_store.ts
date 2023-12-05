import { createContext } from "react";
import { makeObservable, observable, action, toJS } from "mobx";
import { PersistentQueries } from "../api/agent";
import IPersistentQuery, { empty_query } from "../models/persistent_query";

class QueriesStore {
  constructor() {
    makeObservable(this);
  }

  // All queries
  @observable queries: IPersistentQuery[] = [];

  // Selected queries
  @observable selected_query: IPersistentQuery | undefined = undefined;

  @action set_queries = (queries: IPersistentQuery[]) => {
    this.queries = queries;
  };

  @action set_selected_query = (query: IPersistentQuery | undefined) => {
    this.selected_query = query;
  };

  @action lookup = async () => {
    const queires: IPersistentQuery[] = [];
    queires.push(empty_query());
    let res = await PersistentQueries.list();
    if (res.status !== 200) return;
    const loaded_queries: IPersistentQuery[] = res.data;
    queires.push(...loaded_queries);
    this.set_queries(queires);
  };

  @action query_from_id = (query_id: number): IPersistentQuery | undefined => {
    for (let q of this.queries) {
      if (q.id === query_id) return toJS(q);
    }
  };
}

export default createContext(new QueriesStore());
