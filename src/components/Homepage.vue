<template>
  <div>test</div>
</template>

<script>
export default {
  name: "Homepage",
  mounted() {
    if (this.$store.state.user_id != 0) {
      this.$router.push("/chat");
    } else {
      this.$router.push("/login");
    }
  },
};
</script>

<style></style>
