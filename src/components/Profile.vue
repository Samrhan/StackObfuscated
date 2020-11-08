<template>
  <div id="profile" v-if="user">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div id="content" class="content content-full-width">
            <div class="profile">
              <div class="profile-header row">
                <div class="profile-header-cover col"
                     v-bind:style="{backgroundImage:`url(${user.bg_pic && user.bg_pic.length !== 0 ? user.bg_pic: 'https://www.bootdey.com/img/Content/bg1.jpg'})`}"
                ></div>
                <div class="profile-header-content col">
                  <div class="profile-header-img rounded-circle">
                    <!-- Petit tour de magie pour qu'on ne puisse pas tracer l'origine de la requête si qqn met une url qui redirige vers son propre serveur -->
                    <img class="rounded-circle"
                         :src="'https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&refresh=2592000&url='+(user.profile_pic ? user.profile_pic : 'https://cdn.vox-cdn.com/thumbor/ICjwWQhDmr48CIKabxxQilwTVfg=/0x0:786x393/920x613/filters:focal(331x135:455x259):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65101167/obi-wan.0.0.jpg')"
                         alt="" crossorigin="Anonymous" ref="bg_image">
                  </div>
                  <div class="profile-header-info">
                    <h4 class="m-t-10 m-b-5 bio">{{ $route.params.username }}</h4>
                    <p class="m-b-10 text-muted bio" v-if="user.bio">{{ user.bio }}</p>
                    <p class="m-b-10" v-else>
                      <small class="text-muted">Ajoutez une biographie pour vous présenter !</small>
                    </p>
                    <div id="owner-buttons" v-if="owner">
                      <a class="btn btn-sm btn-info mb-2" v-if="!editing" v-on:click="editing = true">Editer
                        votre
                        profil</a>
                      <a class="btn btn-sm btn-info mb-2" v-else ref="button-confirm"
                         v-on:click="submit_edit">Confirmer</a>
                      <a class="btn btn-sm btn-info mb-2" ref="button-post" data-toggle="modal"
                         data-target="#create-post">
                        Poser une question
                      </a>
                    </div>
                  </div>
                </div>
                <div class="col" id="editprofile" v-if="editing">
                  <form v-on:submit.prevent="submit_edit">
                    <div class="form-group">
                      <input type="text" class="form-control" id="bio" aria-describedby="bio"
                             placeholder="Entrez une biographie..." v-model="profile.bio" maxlength="400">
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" id="profile-picture"
                             placeholder="Lien vers la photo de profil..." v-model="profile.profile_pic">
                    </div>
                    <div class="form-group">
                      <input type="text" class="form-control" id="bg-picture"
                             placeholder="Lien vers la photo de couverture..." v-model="profile.bg_pic">
                    </div>
                  </form>
                </div>
              </div>
            </div>
            <div style="margin-top: -30px; margin-bottom: 30px" v-if="posts.length >0">
              <div class="profile-content" v-for="(post, i) in posts" :key="i"
                   style="margin-bottom: -40px; padding-bottom: 0">
                <div class="tab-content p-0">
                  <div class="tab-pane fade active show" id="profile-post">
                    <ul class="timeline">
                      <li>
                        <div class="timeline-time">
                          <span class="date">{{ post.created_at | moment("DD/MM/YYYY") }}</span>
                          <span class="time">{{ post.created_at | moment("HH:mm") }}</span>
                        </div>
                        <div class="timeline-icon">
                          <a>&nbsp;</a>
                        </div>
                        <div class="timeline-body">
                          <div class="timeline-header">
                          <span class="userimage">
                            <img class="rounded-circle" v-if="user.profile_pic" :src="user.profile_pic" alt="">
                            <img class="rounded-circle"
                                 src="https://cdn.vox-cdn.com/thumbor/ICjwWQhDmr48CIKabxxQilwTVfg=/0x0:786x393/920x613/filters:focal(331x135:455x259):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65101167/obi-wan.0.0.jpg"
                                 alt="Photo par défaut" v-else>
                          </span>
                            <span class="username"><a>{{ $route.params.username }}</a> <small></small>
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
                            <div v-for='tag in post.tags' :key='tag' class='tag-input__tag'>
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
            <div v-else>
              <h3 class="masthead-heading mb-0" style="text-align: center">L'utilisateur n'a créé aucun post :(</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="create-post" tabindex="-1" role="dialog" aria-labelledby="create-post-label"
         aria-hidden="true">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="create-post-label">Poser une question</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="timeline-body">
              <div class="timeline-header">
                          <span class="userimage">
                            <img class="rounded-circle" v-if="user.profile_pic" :src="user.profile_pic" alt="">
                    <img class="rounded-circle"
                         src="https://cdn.vox-cdn.com/thumbor/ICjwWQhDmr48CIKabxxQilwTVfg=/0x0:786x393/920x613/filters:focal(331x135:455x259):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/65101167/obi-wan.0.0.jpg"
                         alt="" v-else></span>
                <span class="username"><a>{{ user.username }}</a> <small></small></span>
              </div>
              <div class="timeline-content">
                <form v-on:submit.prevent="submitPost">
                  <div class="form-group">
                    <label for="input-title">Titre</label>
                    <input type="text" class="form-control" id="input-title" placeholder="Je suis nul...."
                           data-role="tagsinput" v-model="new_post.title">
                  </div>
                  <div class="form-group">
                    <label for="input-post">Post : </label>
                    <textarea class="form-control" id="input-post" rows="7" v-model="new_post.content"></textarea>
                  </div>
                  <div class="form-group">
                    <button type="button" class="btn btn-primary" v-if="!insert_code" v-on:click="insert_code = true">
                      Insérer du code
                    </button>
                    <div v-if="insert_code" class="insert-code">
                      <label for="input-post">Code :</label>
                      <prism-editor class="my-editor" v-model="new_post.code" :highlight="highlighter"
                                    line-numbers></prism-editor>
                    </div>
                  </div>
                  <div class='tag-input form-group'>
                    <div v-for='tag in new_post.tags' :key='tag' class='tag-input__tag' id="tag-box">
                      <span @click='removeTag(new_post.tags.indexOf(tag))'>x</span>
                      {{ tag }}
                    </div>
                    <input type='text' :placeholder="new_post.tags.length < 3 ? 'Tags...' : ''" class='tag-input__text'
                           @keydown.enter='addTag'
                           @keydown.188='addTag' @keydown.space="addTag" @keydown.delete='removeLastTag'
                           v-bind:disabled="new_post.tags.length >= 3"/>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
            <button type="button" class="btn btn-primary" data-dismiss="modal" v-on:click="submitPost">Poster</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {PrismEditor} from 'vue-prism-editor';
import 'vue-prism-editor/dist/prismeditor.min.css'; // import the styles somewhere
import {highlight, languages} from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism-tomorrow.css'; // import syntax highlighting styles


export default {
  name: "Profile",
  components: {
    PrismEditor
  },
  data() {
    return {
      user: undefined,
      owner: false,
      editing: false,
      insert_code: false,
      profile: {
        bio: '',
        profile_pic: '',
        bg_pic: '',
      },
      new_post: {
        title: '',
        content: '',
        code: '',
        tags: []
      },
      posts: []
    }
  },
  async mounted() {
    await this.$store.dispatch('me') // On est obligé de rappeller l'api ici
    if (this.$store.state.user && this.$route.params.username === this.$store.state.user.username) {
      this.user = this.$store.state.user
      this.owner = true
    } else if (this.$store.state.tmp_user && this.$store.state.tmp_user[0].username === this.$route.params.username) {
      this.user = this.$store.state.tmp_user // Si on a déjà l'utilisateur dans le cache on ne le recharge pas
    } else {
      await this.$store.dispatch('get_user', this.$route.params.username)
      this.user = this.$store.state.tmp_user[0]
      if (this.user === undefined) {
        return this.$router.replace({name: 'home'})
      }
    }
    this.profile.bio = this.user.bio
    this.profile.bg_pic = this.user.bg_pic
    this.profile.profile_pic = this.user.profile_pic

    await this.$store.dispatch('fetch_post', this.user.id)
    this.posts = this.$store.state.post_list

  },
  methods: {
    submit_edit: async function () {
      this.editing = false
      if (this.profile.profile_pic !== this.user.profile_pic || this.profile.bg_pic !== this.user.bg_pic || this.profile.bio !== this.user.bio)
        await this.$store.dispatch('edit', this.profile)
      this.user = this.$store.state.user
    },
    addTag(event) {
      event.preventDefault()
      let val = event.target.value.trim()
      if (val.length > 0) {
        val = val.substr(0, 10);
        if (this.new_post.tags.indexOf(val) === -1 && this.new_post.tags.length < 3)
          this.new_post.tags.push(val.toLowerCase())
        event.target.value = ''
      }
    },
    removeTag(index) {
      this.new_post.tags.splice(index, 1)
    },
    removeLastTag(event) {
      if (event.target.value.length === 0) {
        this.removeTag(this.new_post.tags.length - 1)
      }
    },
    async submitPost() {
      if (this.new_post.title !== '' && this.new_post.content !== '') {
        await this.$store.dispatch('submit_post', this.new_post)
        this.new_post.title = ''
        this.new_post.content = ''
      }
      this.new_post.code = ''
      this.insert_code = false
      this.new_post.tags = []
    },
    async deletePost(id) {
      await this.$store.dispatch('delete_post', id)
    },
    highlighter(code) {
      return highlight(code, languages.js) // Permet la coloration syntaxique de code
    }
  }
}
</script>

<style scoped>
#profile {
  background: linear-gradient(0deg, #ff6a00 0%, #ee0979 100%) no-repeat scroll center center;
  min-height: 100vh;
}

.profile-header {
  margin-top: 90px;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
}

.profile-header .profile-header-cover {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0
}

.profile-header .profile-header-cover:after { /* effet fondu */
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0, rgba(0, 0, 0, .75) 100%)
}

.profile-header .profile-header-content { /* Permet une meilleure lisiblité de la bio et du nom */
  color: #fff;
  padding: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 40px 50px rgba(0, 0, 0, 0.5);
}

.profile-header-img {
  float: left;
  overflow: hidden;
  z-index: 10;
  margin: 20px;
  padding: 3px;
  border-radius: 4px;
  background: #fff;
}

.profile-header-img img {
  max-width: 100%;
  object-fit: cover;
  width: 120px;
  height: 120px;

}

.profile-header-info h4 {
  font-weight: 500;
  color: #fff
}

.profile-header-img + .profile-header-info {
  margin-left: 140px
}

.profile-header .profile-header-content,
.profile-header .profile-header-tab {
  position: relative
}

.t-plus-1 {
  position: relative !important
}

.profile-header .profile-header-tab {
  background: #fff;
  list-style-type: none;
  margin: -10px 0 0;
  padding: 0 0 0 140px;
  white-space: nowrap;
  border-radius: 0
}

.profile-header .profile-header-tab > li {
  display: inline-block;
  margin: 0
}

.profile-header .profile-header-tab > li > a {
  display: block;
  color: #929ba1;
  line-height: 20px;
  padding: 10px 20px;
  text-decoration: none;
  font-weight: 700;
  font-size: 12px;
  border: none
}

.profile-header .profile-header-tab > li.active > a,
.profile-header .profile-header-tab > li > a.active {
  color: #242a30
}

.profile-content {
  padding: 25px;
  border-radius: 4px
}

.profile-content:after,
.profile-content:before {
  content: '';
  display: table;
  clear: both
}

.profile-content .tab-content,
.profile-content .tab-pane {
  background: 0 0
}

.profile-image img {
  display: block;
  max-width: 100%;
  height: 175px;
  object-fit: contain;
}

#owner-buttons a {
  margin-right: 10px;
}

.profile-highlight h4 {
  margin: 0 0 7px;
  font-size: 12px;
  font-weight: 700
}

.table.table-profile > thead > tr > th {
  border-bottom: none !important
}

.table.table-profile > thead > tr > th h4 {
  font-size: 20px;
  margin-top: 0
}

.table.table-profile > thead > tr > th h4 small {
  display: block;
  font-size: 12px;
  font-weight: 400;
  margin-top: 5px
}

.table.table-profile > tbody > tr > td,
.table.table-profile > thead > tr > th {
  border: none;
  padding-top: 7px;
  padding-bottom: 7px;
  color: #242a30;
  background: 0 0
}

.table.table-profile > tbody > tr > td.field {
  width: 20%;
  text-align: right;
  font-weight: 600;
  color: #2d353c
}

.table.table-profile > tbody > tr.highlight > td {
  border-top: 1px solid #b9c3ca;
  border-bottom: 1px solid #b9c3ca
}

.table.table-profile > tbody > tr.divider > td {
  padding: 0 !important;
  height: 10px
}


.profile-section .title small {
  font-weight: 400
}

#editprofile {
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  box-shadow: 0 0 40px 50px rgba(0, 0, 0, 0.5);
}

.timeline {
  list-style-type: none;
  margin: 0;
  padding: 0;
  position: relative
}

.timeline:before {
  content: '';
  position: absolute;
  top: 5px;
  bottom: 5px;
  width: 5px;
  background: #2d353c;
  left: 20%;
  margin-left: -2.5px
}

.timeline > li {
  position: relative;
  min-height: 50px;
  padding: 20px 0
}

.timeline .timeline-time {
  position: absolute;
  left: 0;
  width: 18%;
  text-align: right;
  top: 30px
}

.timeline .timeline-time .date,
.timeline .timeline-time .time {
  display: block;
  font-weight: 600
}

.timeline .timeline-time .date {
  line-height: 16px;
  font-size: 12px
}

.timeline .timeline-time .time {
  line-height: 24px;
  font-size: 20px;
  color: #242a30
}

.timeline .timeline-icon {
  left: 15%;
  position: absolute;
  width: 10%;
  text-align: center;
  top: 40px
}

.timeline .timeline-icon a {
  text-decoration: none;
  width: 20px;
  height: 20px;
  display: inline-block;
  border-radius: 20px;
  background: #d9e0e7;
  line-height: 10px;
  color: #fff;
  font-size: 14px;
  border: 5px solid #2d353c;
  transition: border-color .2s linear
}

.timeline .timeline-body {
  margin-left: 23%;
  margin-right: 17%;
  background: #fff;
  position: relative;
  padding: 20px 25px;
  border-radius: 6px
}

.timeline .timeline-body:before {
  content: '';
  display: block;
  position: absolute;
  border: 10px solid transparent;
  border-right-color: #fff;
  left: -20px;
  top: 20px
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

.lead {
  margin-bottom: 20px;
  font-size: 21px;
  font-weight: 300;
  line-height: 1.4;
}

.text-danger, .text-red {
  color: #ff5b57 !important;
}

#input-title {
  border-radius: 20px;
}

.tag-input {
  width: 100%;
  border: 2px solid #eed;
  border-radius: 20px;
  font-size: 0.9em;
  height: 50px;
  box-sizing: border-box;
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

.tag-input__tag > span {
  cursor: pointer;
  opacity: 0.75;
}

.tag-input__text {
  border: none;
  outline: none;
  line-height: 50px;
  background: none;
  width: 50%;
}

.post-tags {
  border: 0;
  padding: 0;
  border-top: 1px solid lightgray;
  border-radius: 0
}

.insert-code {
  border: 1px solid lightgray;
  border-radius: 20px;
  padding: 15px;
}
</style>