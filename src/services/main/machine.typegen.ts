
  // This file was automatically generated. Edits will be overwritten

  export interface Typegen0 {
        '@@xstate/typegen': true;
        internalEvents: {
          "": { type: "" };
"done.invoke.fetchNews": { type: "done.invoke.fetchNews"; data: unknown; __tip: "See the XState TS docs to learn how to strongly type this." };
"error.platform.fetchNews": { type: "error.platform.fetchNews"; data: unknown };
"xstate.after(timeToGetEnvironmentVariables)#main.cache": { type: "xstate.after(timeToGetEnvironmentVariables)#main.cache" };
"xstate.init": { type: "xstate.init" };
        };
        invokeSrcNameMap: {
          "fetchNews": "done.invoke.fetchNews";
        };
        missingImplementations: {
          actions: "forwardDefaultQuery" | "forwardQuery" | "setInput" | "setNews";
          delays: "timeToGetEnvironmentVariables";
          guards: "isInputIsEmpty";
          services: never;
        };
        eventsCausingActions: {
          "forwardDefaultQuery": "xstate.after(timeToGetEnvironmentVariables)#main.cache";
"forwardQuery": "SEARCH";
"setInput": "INPUT";
"setNews": "done.invoke.fetchNews";
        };
        eventsCausingDelays: {
          "timeToGetEnvironmentVariables": "xstate.after(timeToGetEnvironmentVariables)#main.cache" | "xstate.init";
        };
        eventsCausingGuards: {
          "isInputIsEmpty": "";
        };
        eventsCausingServices: {
          "fetchNews": "" | "xstate.after(timeToGetEnvironmentVariables)#main.cache" | "xstate.init";
        };
        matchesStates: "cache" | "work" | "work.search" | "work.search.active" | "work.search.active.idle" | "work.search.active.loading" | "work.search.checking" | "work.search.inactive" | { "work"?: "search" | { "search"?: "active" | "checking" | "inactive" | { "active"?: "idle" | "loading"; }; }; };
        tags: never;
      }
  