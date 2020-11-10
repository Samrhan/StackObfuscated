<template>
  <div id="post" v-if="post">
    <div style="margin-top: -30px; margin-bottom: 30px">
      <div class="profile-content"
           style="margin-bottom: -40px; padding-bottom: 0">
        <div class="tab-content p-0">
          <div class="tab-pane fade active show" id="profile-post">
            <ul class="timeline">
              <li>
                <div class="timeline-icon">
                  <a>&nbsp;</a>
                </div>
                <div class="timeline-body">
                  <div class="timeline-header" v-on:click="$router.push({name:'profile', params:{username:user.username}})">
                          <span class="userimage">
                            <img class="rounded-circle" v-if="user.profile_pic" :src="user.profile_pic" alt="">
                            <img class="rounded-circle"
                                 src="https://cdn.vox-cdn.com/thumbor/ICjwWQhDmr48CIKabxxQilwTVfg=/0x0:786x393/920x613/filters:focal(331x135:455x259):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65101167/obi-wan.0.0.jpg"
                                 alt="Photo par défaut" v-else>
                          </span>
                    <span class="username"><a>{{ user.username }}</a> <small></small>
                            </span>
                    <i v-if="owner" class="fa fa-trash" v-on:click="deletePost(post.id)" style="cursor:pointer;"
                       title="Supprimer le post"></i>
                  </div>
                  <div class="timeline-title">
                    <p>
                      {{ post.title }}
                    </p>
                  </div>
                  <div class="timeline-content">
                    <p>
                      {{ post.content }}
                    </p>
                    <prism-editor :highlight="highlighter" readonly language="javascript"
                                  v-if="post.code && post.code !== ''" v-model="post.code"></prism-editor>
                  </div>
                  <div class='tag-input form-group post-tags'>
                    <div v-for='tag in post.tags' :key='tag' class='tag-input__tag' v-on:click="$router.push({name:'tagpage', params:{tag_name: tag}})">
                      {{ tag }}
                    </div>
                  </div>
                  <div class="timeline-likes">
                    <div class="stats-right">
                      <span class="stats-text">21 Réponses</span>
                    </div>
                    <div class="stats">
                            <span class="fa-stack fa-fw stats-icon">
                              <i class="fa fa-circle fa-stack-2x text-primary"></i>
                              <i class="fa fa-thumbs-up fa-stack-1x fa-inverse"></i>
                            </span>
                      <span class="stats-total">{{ post.votes }}</span>
                    </div>
                  </div>
                  <div class="timeline-footer" v-if="$store.state.user">
                    <a class="m-r-15 text-inverse-lighter"><i
                        class="fa fa-thumbs-up fa-fw fa-lg m-r-3"></i> Like</a>
                  </div>
                  <div class="timeline-comment-box" v-if="$store.state.user">
                    <div class="user"><img :src="$store.state.user.profile_pic"></div>
                    <div class="input">
                      <form action="">
                        <div class="input-group">
                          <input type="text" class="form-control rounded-corner" placeholder="Useless...">
                          <span class="input-group-btn p-l-10">
                                          <button class="btn btn-primary f-s-12 rounded-corner"
                                                  type="button">Répondre</button>
                                          </span>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {highlight, languages} from "prismjs/components/prism-core";
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles

export default {
  name: "Post",
  data() {
    return {
      post: {},
      user: {},
      owner: false
    }
  },
  async mounted() {
    this.post = this.$store.state.tags_posts.find(post => post.id === this.id)
    if (!this.post) {
      //Si le post n'est pas dans le cache on le télécharge
      await this.$store.dispatch('fetch_post', this.id)
      this.post = this.$store.state.post_list.find(post => post.id === this.id)
    }

    if (!this.$store.state.tmp_user || this.$store.state.tmp_user && !this.$store.state.tmp_user[this.post.user_id]) {
      await this.$store.dispatch('get_user', this.post.user_id)
    }
    this.user = this.$store.state.tmp_user[this.post.user_id]
  },
  computed: {
    id: function () {
      return parseInt(this.$route.params.post_id)
    }
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.js) // Permet la coloration syntaxique de code
    }
  }
}
</script>

<style scoped>

#post {
  background: linear-gradient(0deg, #ff6a00 0%, #ee0979 100%) no-repeat scroll center center;
  min-height: 100vh;
}

.timeline {
  list-style-type: none;
  padding: 0;
  position: relative;
}


.timeline > li {
  position: relative;
  min-height: 50px;
  padding: 20px 0;
}


.timeline .timeline-body {
  margin-left: 23%;
  margin-right: 17%;
  background: #fff;
  position: relative;
  padding: 20px 25px;
  border-radius: 6px;
  margin-top: 100px;
}

@media (max-width: 700px){
  .timeline .timeline-body {
    margin-left: 0;
    margin-right: 0;
    margin-top: 100px;
  }
}


.timeline .timeline-body > div + div {
  margin-top: 15px
}

.timeline .timeline-body > div + div:last-child {
  margin-bottom: -20px;
  padding-bottom: 20px;
  border-radius: 0 0 6px 6px
}

.timeline-header {
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e7eb;
  line-height: 30px
}

.timeline-header .userimage {
  float: left;
  border-radius: 40px;
  overflow: hidden;
  margin: -2px 10px -2px 0
}

.userimage img {
  width: 34px;
  height: 34px;
  object-fit: cover;
}

.timeline-header .username {
  font-size: 16px;
  font-weight: 600
}

.timeline-header .username,
.timeline-header .username a {
  color: #2d353c
}

.timeline img {
  max-width: 100%;
  display: block
}

.timeline-content {
  letter-spacing: .25px;
  line-height: 18px;
  font-size: 13px
}

.timeline-content textarea {
  border-radius: 20px;
}

.timeline-content:after,
.timeline-content:before {
  content: '';
  display: table;
  clear: both
}

.timeline-title {
  margin-top: 0;
  font-size: 30px;
  border-bottom: 1px solid #e2e7eb;
}

.timeline-footer {
  background: #fff;
  border-top: 1px solid #e2e7ec;
  padding-top: 15px
}

.timeline-footer a:not(.btn) {
  color: #575d63
}

.timeline-footer a:not(.btn):focus,
.timeline-footer a:not(.btn):hover {
  color: #2d353c
}

.timeline-likes {
  color: #6d767f;
  font-weight: 600;
  font-size: 12px
}

.timeline-likes .stats-right {
  float: right
}

.timeline-likes .stats-total {
  display: inline-block;
  line-height: 20px
}

.timeline-likes .stats-icon {
  float: left;
  margin-right: 5px;
  font-size: 9px
}

.timeline-likes .stats-icon + .stats-icon {
  margin-left: -2px
}

.timeline-likes .stats-text {
  line-height: 20px
}

.timeline-likes .stats-text + .stats-text {
  margin-left: 15px
}

.timeline-comment-box {
  background: #f2f3f4;
  margin-left: -25px;
  margin-right: -25px;
  padding: 20px 25px
}

.timeline-comment-box .user {
  float: left;
  overflow: hidden;
  border-radius: 30px
}

.timeline-comment-box .user img {
  width: 34px;
  height: 34px;
  object-fit: cover;
}

.timeline-comment-box .user + .input {
  margin-left: 44px
}

.post-tags {
  border: 0;
  padding: 0;
  border-top: 1px solid lightgray;
  border-radius: 0
}
.tag-input {
  width: 100%;
  font-size: 0.9em;
  height: 50px;
  padding: 0 10px;
}

.tag-input__tag {
  height: 30px;
  float: left;
  margin-right: 10px;
  background-color: #eee;
  margin-top: 10px;
  line-height: 30px;
  padding: 0 10px;
  border-radius: 20px;
}

</style>