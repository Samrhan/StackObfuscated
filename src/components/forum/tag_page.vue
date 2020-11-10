<template>
  <div class="forum">
    <nav aria-label="breadcrumb" class="history">
      <ol class="breadcrumb">
        <li class="breadcrumb-item"><a v-on:click.prevent="$router.push({name:'forum'})" href="/forum">Forum</a></li>
        <li class="breadcrumb-item active" aria-current="page">{{ tag_title }}</li>
      </ol>
    </nav>
    <div id="secondary" class="panel panel-forum">
      <div class="panel-heading">
        <a data-original-title="" title="">{{ tag_title }}</a>
      </div>
      <div class="panel-inner">
        <table class="footable table table-striped table-primary table-hover footable-loaded tablet">
          <thead>
          <tr>
            <th class="footable-visible footable-first-column" data-class="expand">Titre</th>
            <th class="large110 footable-visible" data-hide="phone">Statistiques</th>
            <th class="large21 footable-visible footable-last-column" data-hide="phone">Dernière Réponse</th>
          </tr>
          </thead>
          <tbody>
          <tr class="forum-2" v-for="(post, i) in posts" :key="i" v-on:click="$router.push({name:'post', params:{post_id:post.id}})">
            <td class="expand footable-visible footable-first-column" title="No unread posts"><span
                class="footable-toggle"></span>
              <span class="icon-wrapper">
                  <i class="fa fa-file"></i>
                </span>
              <i class="row-icon-font-mini"></i>
              <span class="desc-wrapper">
                <a class="forumtitle" data-original-title=""
                   title="">{{ post.title }}</a><br><br>
                </span>
            </td>
            <td class="stats-col footable-visible">
                <span class="stats-wrapper">
                  21&nbsp;réponses&nbsp;<br>56&nbsp;like
                </span>
            </td>
            <td class="footable-visible footable-last-column">
            </td>
          </tr>
          <tr class="forum-5">
            <td class="expand footable-visible footable-first-column" title="No unread posts"><span
                class="footable-toggle"></span>
              <span class="icon-wrapper">
                  <i class="fa fa-book"></i>
                </span>
              <i class="row-icon-font-mini"></i>
              <span class="desc-wrapper">
                <nav aria-label="Page navigation example">
                  <ul class="pagination">
                    <li class="page-item" v-bind:class="{disabled:page === 1}"><a class="page-link" v-on:click="change_page(page-1)">&laquo;</a></li>
                    <li class="page-item" v-for="i in Math.floor(tag_number/10) + 1" :key="i" v-bind:class="{active:page=== i}"><a
                        class="page-link" v-on:click="change_page(i)">{{ i }}</a></li>
                    <li class="page-item" v-bind:class="{disabled:page === max_page}"><a class="page-link" v-on:click="change_page(page+1)">&raquo;</a></li>
                  </ul>
                </nav>
              </span>
            </td>
            <td class="stats-col footable-visible">
            </td>
            <td class="footable-visible footable-last-column">
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "tag_page",
  data() {
    return {
      posts: [],
      page: 1,
      max_page: 0,
      tag_number: 0
    }
  },
  async mounted() {
    let payload = {name : this.tag, start : 0}
    await this.$store.dispatch('get_tag_post', payload)
    this.posts = this.$store.state.tags_posts
    this.post_number = this.$store.state.tags_posts_number
    this.max_page = Math.floor(this.tag_number / 10) + 1
  },
  methods: {
    change_page: async function (i) {
      if (this.page !== i) {
        this.page = i
        await this.$store.dispatch('popular_tags', (i-1)*10)
        this.posts = this.$store.state.tags_posts
      }
    }
  },
  computed:{
    tag: function(){
      return this.$route.params.tag_name
    },
    tag_title: function(){
      return this.tag[0].toUpperCase() + this.tag.slice(1)
    }
  },
  watch:{
    $route (){
      this.$router.go()
    }
  }
}
</script>

<style scoped>

.history{
  margin: 100px 100px 20px;
}

.breadcrumb{
  border-radius: 20px;
}

.forum {
  background: linear-gradient(0deg, #ff6a00 0%, #ee0979 100%) no-repeat scroll center center;
  min-height: 100%;
  width: 100%;
  position: absolute;
}

#secondary {
  margin: 20px 100px;
}

@media (max-width: 700px) {
  #secondary {
    margin: 20px 0 0;
  }

  .history {
    margin: 100px 0 20px;
  }
}

.panel-forum {
  border-radius: 20px;
}

.panel-heading {
  font-size: 14px;
  font-family: 'Source Sans Pro', 'Arial', 'Helvetica', sans-serif;
  border-bottom: 1px solid transparent;
  font-weight: 700;
  line-height: 40px;
  height: 40px;
  padding-left: 20px;
  text-transform: uppercase;
  color: #fff;
  border-radius: 20px 20px 0 0;
  background-color: #26bcb5;
}

.panel-inner table {
  box-sizing: border-box;
  border-spacing: 0;
  border-collapse: collapse;
  max-width: 100%;
  width: 100%;
  margin-bottom: 0;
  border-top: 0;
  background: #fff;
  border-radius: 0 0 20px 20px;

}

.panel-inner thead {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 14px;
  color: #8d9aa5;
  border-spacing: 0;
  border-collapse: collapse;
  box-sizing: border-box;
}

.panel-inner tbody {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 14px;
  font-family: 'Source Sans Pro', 'Arial', 'Helvetica', sans-serif;
  color: #8d9aa5;
  border-spacing: 0;
  border-collapse: collapse;
  box-sizing: border-box;
}

.forum-2 {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 14px;
  line-height: 1.42857143;
  font-family: 'Source Sans Pro', 'Arial', 'Helvetica', sans-serif;
  color: #8d9aa5;
  border-spacing: 0;
  border-collapse: collapse;
  box-sizing: border-box;
  background-color: #f9f9f9;
}

.icon-wrapper {
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  font-size: 14px;
  font-family: 'Source Sans Pro', 'Arial', 'Helvetica', sans-serif;
  border-spacing: 0;
  border-collapse: collapse;
  color: #94a0a0;
  box-sizing: border-box;
  float: left;
  width: 50px;
  height: 50px;
  margin-right: 8px;
  transition: background .1s ease 0s;
  border-radius: 50%;
  background-color: #e4e9eb;
}

.icon-wrapper i {
  font-size: 26px;
  line-height: 48px;
  position: relative;
  display: block;
  height: 48px;
  text-align: center;
}

@media (max-width: 700px) {
  .icon-wrapper {
    display: none;
  }
}

</style>
