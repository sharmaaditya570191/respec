"use strict";

import {
  flushIframes,
  makeBasicConfig,
  makeDefaultBody,
  makeRSDoc,
} from "../SpecHelper.js";

describe("Core — Definition finder", () => {
  afterAll(flushIframes);

  it("shouldn't duplicate data-lt items or add redundant ones", async () => {
    const bodyText = `
      <section>
        <h2>Test section</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo {
            void bar();
          };
        </pre>
        <dfn data-dfn-for="Foo" data-lt="bar()">bar</dfn>
        <dfn>Foo</dfn>
      </section>`;
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    const doc = await makeRSDoc(ops);
    const [barDfn, fooDfn] = doc.getElementsByTagName("dfn");
    expect(barDfn.dataset.lt).toBe("bar()");
    expect(barDfn.dataset.localLt).toBe("Foo.bar|Foo.bar()|bar");
    expect(barDfn.dataset.dfnFor).toBe("Foo");
    expect(barDfn.classList.contains("respec-offending-element")).toBeFalsy();
    expect(fooDfn.dataset.lt).toBeUndefined();
    expect(fooDfn.dataset.dfnFor).toBe("");
  });

  it("should enumerate operation alternative names", async () => {
    const bodyText = `
      <section data-dfn-for="Foo">
        <h2>Test section</h2>
        <pre class="idl">
          [Exposed=Window]
          interface Foo {
            void bar();
            void baz();
          };
        </pre>
        <dfn id="bar">bar</dfn>
        <dfn id="baz">baz()</dfn>
      </section>`;
    const ops = {
      config: makeBasicConfig(),
      body: makeDefaultBody() + bodyText,
    };
    const doc = await makeRSDoc(ops);
    const bar = doc.getElementById("bar");
    expect(bar.dataset.localLt).toBe("Foo.bar|Foo.bar()|bar");
    expect(bar.dataset.lt).toBe("bar()");
    const baz = doc.getElementById("baz");
    expect(baz.dataset.localLt).toBe("Foo.baz|Foo.baz()|baz");
    expect(baz.dataset.lt).toBe("baz()");
  });
});
