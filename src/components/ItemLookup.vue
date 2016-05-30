<template>
	<div class="item-lookup">
		Gelet op 
		<a href="#" v-if="art" @click.prevent="show=!show" v-text="art.title"></a>
		<span v-if="!art || editing">
			<input type="text" v-model="value" keydown.enter="editing=false">
		</span>
	  <span class="item-toggle" v-else @click="editing=!editing">bewerken</span>
	  <p v-if="show&&art" v-text="art.text" class="item-lookup-text"></p>
	</div>
</template>

<script>
export default {
	props: ['ref'],
	data () {
		return {
			editing: null,
			show: null
		}
	},
	computed: {
		prop () {
			return this.propObj && this.propObj['rdfs:label'] && this.propObj['rdfs:label']['@value'] || this.ref.prop
		},
		propObj () {
			return this.$root.map[this.ref.prop]
		},
		value: {
			get () {
				var v = this.ref.value
				if (!v) {
					return '?'
				}
				v = v['id'] || v['@id'] || v || '??'
				if (v && v.startsWith('_:')) {
					return v.slice(2)
				}
				return v
			},
			set (text) {
				if (text && !text.startsWith('_:')) {
					text = '_:' + text
				}
				this.$set('ref.value', {'@id': text})
			}
		},
		art () {
			var v = JSON.parse(JSON.stringify(this.ref.value))
			if (!v) {
				return '?'
			}
			v = v['id'] || v['@id'] || v || '??'

			if (v && v.startsWith('_:gemeentedecreet')) {
				var art = this.$root.gemeentedecreet && this.$root.gemeentedecreet[v]
				if (art) {
					art.title = 'Gemeentedecreet Art. ' + v.slice(18)
					return art
				}
			}
			return null
		}
	}
}
</script>