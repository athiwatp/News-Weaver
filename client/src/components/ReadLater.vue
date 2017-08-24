<template>
    <div>
        <EmptyFeed
            v-if="readingList.length <= 0"
            heading="No results found"
            description="I'm sorry but it looks like you have not added anything to read later. Add a few then check back."
        >
        </EmptyFeed>
        <v-layout row wrap>
            <NewsCard 
                v-for="(item, index) in readingList" 
                :item="item"
                :viewNews="viewNews"
                :key="item.hash"
                :index="index"
            >
                <div class="one-fourth" slot="slot_1">
                    <v-btn 
                        class="orange--text"
                        flat
                        icon
                        @click.stop="markNewsAsRead(item, index)"
                    >
                        <v-icon class="orange--text">
                            {{ item.read ? 'fa-check-square' : 'fa-check-square-o' }}
                        </v-icon>
                    </v-btn>
                </div>
                <div class="one-fourth" slot="slot_2">
                    <v-btn
                        class="pink--text"
                        flat
                        icon
                        @click.stop="deleteNewsFromReadingList(item)"
                    >
                        <v-icon class="pink--text">fa-trash-o</v-icon>
                    </v-btn>
                </div>
            </NewsCard>
        </v-layout>
        <NewsView
            :showModal="showNewsModal"
            :item="selectedNews"
            :closeModal="closeNewsModal"
        >
            <v-btn
                slot="slot_1"
                flat 
                class="orange--text" 
                :value="true"
                @click.stop="markNewsAsRead(selectedNews, selectedNewsIndex)"
            >
                <span>Mark As read</span>
                <v-icon>
                    {{ selectedNews.read ? 'fa-check-square' : 'fa-check-square-o' }}
                </v-icon>
            </v-btn>
            <v-btn
                slot="slot_2"
                flat 
                class="pink--text" 
                :value="true"
                @click.stop="deleteNewsFromReadingList(selectedNews)"
            >
                <span>Delete</span>
                <v-icon>
                    fa-trash-o
                </v-icon>
            </v-btn>
        </NewsView>
    </div>
</template>

<script>
    import {
        getReadingList,
        markAsRead,
        removeFromReadingList
    } from './../api/api';
    import EmptyFeed from './sub-components/EmptyFeed.vue';
    import NewsCard from './sub-components/NewsCard.vue';
    import NewsView from './sub-components/NewsView.vue';

    export default {
        data() {
            return {
                readingList: [],
                selectedNews: {},
                selectedNewsIndex: -1,
                showNewsModal: false
            };
        },
        components: {
            NewsCard,
            NewsView,
            EmptyFeed
        },
        watch: {
            '$route' () {
                this.fetchReadingList();
            }
        },
        mounted() {
            this.fetchReadingList();
        },
        methods: {
            fetchReadingList() {
                getReadingList()
                    .then(data => {
                        if (data.error === undefined) {
                            if (data.success) {
                                console.log(data.news);
                                this.readingList.push(...data.news);
                            } else {
                                this.$emit('displayMessage', 'warning', data.message);
                            }
                        } else {
                            this.$emit('displayMessage', 'error', data.error);
                        }
                    });
            },
            deleteNewsFromReadingList(item) {
                var hash = item.hash;
                removeFromReadingList(hash)
                    .then(data => {
                        if (data.error === undefined) {
                            if (data.success) {
                                this.readingList = this.readingList.filter(element => {
                                    return element.hash !== hash;
                                });
                                this.closeNewsModal();
                                this.$emit('displayMessage', 'success', data.message);
                            } else {
                                this.$emit('displayMessage', 'warning', data.message);
                            }
                        } else {
                            this.$emit('displayMessage', 'error', data.error);
                        }
                    });
            },
            markNewsAsRead(item, index) {
                markAsRead(item.hash)
                    .then(data => {
                        if (data.error === undefined) {
                            if (data.success) {
                                if (this.selectedNews.read !== undefined)
                                    this.selectedNews.read = true;
                                this.readingList[index].read = true;

                                this.$emit('displayMessage', 'success', data.message);
                            } else {
                                this.$emit('displayMessage', 'warning', data.message);
                            }
                        } else {
                            this.$emit('displayMessage', 'error', data.error);
                        }
                    });
            },
            viewNews(item, index) {
                this.showNewsModal = true;
                this.selectedNews = item;
                this.selectedNewsIndex = index;
            },
            closeNewsModal() {
                this.showNewsModal = false;
                this.selectedNews = {};
                this.selectedNewsIndex = -1;
            }
        }
    };
</script>