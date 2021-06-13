<template>
  <div class="hello">
    {{ machine }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { lightMachine } from "../models/lightMachine";
import { toDirectedGraph } from "@xstate/graph";
import { StateNode } from "xstate";

export default defineComponent({
  name: "HelloWorld",
  data() {
    return {
      machine: {},
    };
  },
  created() {
    this.machine = toDirectedGraph(lightMachine as StateNode);
  },
  props: {
    msg: String,
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
