<template>
  <div>
    <p>
      Would you like to enter some text and then see it displayed back to you?
      Don't worry, nothing bad could ever happen :)
    </p>
    <input v-model="userInput" type="text" placeholder="Enter">
    <div v-html="getUserInput"></div>

    <p>
      Would you like to enable XSS?
      <input
        id="isXSSEnabled"
        type="checkbox"
        v-model="isXSSEnabled"
      />

    </p>
    <p>Try using this: &lt;img src=1 onerror=alert(document.cookie);&gt;</p>
    <p>Being logged in is recommended so there's actually a cookie to show</p>
  </div>
</template>

<script>
import sanitizeHtml from 'sanitize-html'
export default {
  data() {
    return {
      userInput: "",
      isXSSEnabled: this.getXSS()
    };
  },
  watch: {
    isXSSEnabled(newValue) {
      localStorage.setItem("xssEnabled", newValue);
    },
  },
  methods: {
    getXSS() {
      const accessControl = localStorage.getItem("xssEnabled")
      return accessControl ? JSON.parse(accessControl) : false;
    }
  },
  computed:{
    getUserInput() {
      if (this.getXSS()) {
        return this.userInput;
      }
      return sanitizeHtml(this.userInput);
    }
  }
};
</script>
