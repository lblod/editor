<template>
	<a href="#" class="p-ref-a">{{prop}}: {{ value }}</a>
</template>

<script>
export default {
	props: ['ref'],
	computed: {
		prop () {
			return this.propObj && this.propObj['rdfs:label'] && this.propObj['rdfs:label']['@value'] || this.ref.prop
		},
		propObj () {
			return this.$root.map[this.ref.prop]
		},
		value () {
			var v = JSON.parse(JSON.stringify(this.ref.value))
			if (!v) {
				return '?'
			}
			if (v['@id']) {
				console.log(this.$root.map[v['@id']], v)
				v = this.$root.map[v['@id']] || v
			}
			return v['schema:name'] || v.text || v['@id'] || v || '??'
		}
	}
}
</script>