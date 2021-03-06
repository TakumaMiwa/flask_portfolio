let InputForm = {
    data: function (){
        return {
            card_value: 0,
            count: 0,
            id: 0,
        }
    },
    props: {
        cards: {
            type: Array,
            default: []
        },
    },
    methods: {
        addCard: function () {
            this.count += 1;
            if (this.card_value == null) this.card_value = 0;
            this.id = this.makeId();
            this.cards.push({'id': this.id, 'value': Number(this.card_value), 'count': Number(this.count), 'position': this.cards.length})
            this.$emit('addCard', this.cards);
        },
        removeCard: function (task_id) {
            alert(task_id);
            this.$emit('removeCard', task_id);
        },
        makeId: function () {
            return new Date().getTime().toString(16)  + Math.floor(10*Math.random()).toString(16)
        },
        exchangeCard: function () {
            this.$emit('exchangeCard')
        }
    },
    template: `
        <div class="input-form" id="input-div">
            <input type="number" name="number" id="input-number" v-model.number="card_value">
            <button v-on:click="addCard">Add Card</button>
            <button v-on:click="exchangeCard">Exchange</button>
        </div>
        `
}
let RemoveButton = {
    template:'<button v-on:click="removeCard">remove</button>',
    props: {
        'card_id': {
            default: 0
        }
    },
    methods: {
        removeCard: function () {
            this.$emit('removeCard', this.card_id);
        },
    }
}
let CardTable = {
    template: `
            <div class="card-table" id="card-table">
                <h1> table </h1>
                <transition-group name="flip-list" tag="div">
                    <div v-for="item of sortedItemsByPosition" :key="item.id" class="card">
                        <h3>{{ item.value }}</h3>
                        <RemoveButton @removeCard="removeCard" card_id="item.id"/>
                    </div>
                </transition-group>
            </div>`,
    methods: {
        removeCard: function (card_id) {
            this.$emit('removeCard2', card_id)
        }
    },
    components: {
       'RemoveButton': RemoveButton,
    },
    props: {
        cards: {
            type: Array,
            default: []
        }
    },
    computed: {
        sortedItemsByPosition() {
            return this.cards.sort((a, b) => {
                return (a.position < b.position) ? -1 : (a.position > b.position) ? 1 : 0;
            });;
        }
    }
}
let ParentTable = {
    template: '<div class="app"><input-form :cards="cards" @addCard="cards = $event" @exchangeCard="exchangeCard" /><table-design :cards="cards" @removeCard="removeCard"/></div>',
    components: {
        'input-form': InputForm,
        'table-design': CardTable
    },
    data: function (){
        return {
            cards: []
        }
    },
    methods: {
        removeCard: function (card_id) {
            let index;
            for (let i=0; i<this.cards.length; i++){
                if (this.cards[i].id === card_id)index=i;
                break;
            }
            this.cards.splice(index, 1);
        },
        exchangeCard: function () {
            let a = this.cards[0].position;
            this.cards[0].position = this.cards[2].position;
            this.cards[2].position = a;
        }
    }
}

new Vue({
    el: '#content',
    components: {
        'app': ParentTable
    }
});