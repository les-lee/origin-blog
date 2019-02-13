<template>
  <div>
    <div ref="preview" class="preview">
      <article class="scroller-padding">
        <section>
          <h2>Section one</h2>
        </section>
        <section>
          <h2>Section two</h2>
        </section>
        <section>
          <h2>Section three</h2>
        </section>
      </article>
    </div>
    <textarea ref="playableHtml" class="playable playable-html">
<article class="scroller-padding">
  <section>
    <h2>Section one</h2>
  </section>
  <section>
    <h2>Section two</h2>
  </section>
  <section>
    <h2>Section three</h2>
  </section>
</article>
    </textarea>
    <textarea ref="playableCss" class="playable playable-css" />
    <div class="playable-buttons">
      <input ref="reset" id="reset" type="button" value="Reset">
    </div>
  </div>
</template>

<script>
import "../styles/playable.styl";
export default {
  mounted: function() {
    var section = this.$refs.preview;
    var editable = document.createElement("style");
    editable.setAttribute("type", "text/css");
    var textareaHTML = this.$refs.playableHtml
    var textareaCSS = this.$refs.playableCss
    var reset = this.$refs.reset
    console.log(textareaHTML, 'value')
    var htmlCode = textareaHTML.value;
    var cssCode = null;

    editable.innerHTML = cssCode = textareaCSS.value =`
      .scroller-padding {
        height: 300px;
        overflow-y: scroll;
        scroll-snap-type: y mandatory;
        scroll-padding: 40px;
      }
      .scroller-padding section {
        height: 300px;
        background: #eee;
        scroll-snap-align: start;
      }`;

    document.querySelector("head").appendChild(editable);

    function fillCode() {
      // console.log("fill");
      editable.innerHTML = textareaCSS.value;
      section.innerHTML = textareaHTML.value;
    }

    reset.addEventListener("click", function() {
      textareaHTML.value = htmlCode;
      textareaCSS.value = cssCode;
      fillCode();
    });

    textareaHTML.addEventListener("input", fillCode);
    textareaCSS.addEventListener("input", fillCode);
  },
  methods: {}
};
</script>

<style>
</style>
