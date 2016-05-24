<template>
	<div class="inp-spatial inp-text" @click="start">
		{{model ? 'Wijzigen...' : 'Selecteren...'}}
		<div class="inp-spatial-fixed" v-show="showMap" transition="opacify">
			<div class="inp-spatial-cancel">Annuleren</div>
    	<div class="inp-spatial-map" @click.stop></div>
		</div>
	</div>
</template>

<script>
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'
import L from 'leaflet'
import draw from 'leaflet-draw'

export default {
	props: ['model'],
	data () {
		return {
			showMap: null
		}
	},
	methods: {
		start () {
			this.showMap = !this.showMap
			this.$nextTick(() => this.initMap())
	  },
	  initMap () {
	  	if (this.mapReady) {
	  		return
	  	}
	  	this.mapReady = true
	    var self = this
	    var el = this.$el.querySelector('.inp-spatial-map')
	    var map = L.map(el).setView([50.6, 4.6], 6);
	    var extentLayer
	    // add an OpenStreetMap tile layer
	    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	        attribution: ''
	    }).addTo(map);

	    // Initialize the draw control
	    map.addControl(new L.Control.Draw({
	      position: 'topright',
	      draw: {
	        polyline: false, polygon: false,
	        circle: false, marker: false,
	        rectangle: {
	          title: 'Draw rectangle'
	        }
	      }
	    }));

	    this.$el.querySelector('.leaflet-draw-draw-rectangle').addEventListener('click', function(e) {
	      self.$el.classList.add('map-expanded');
	      L.Util.requestAnimFrame(map.invalidateSize, map, false, map._container);
	    });

	    // When user finishes drawing the box, record it and add it to the map
	    map.on('draw:created', function (e) {
	      if (extentLayer) {
	        map.removeLayer(extentLayer);
	      }
	      extentLayer = e.layer;
	      map.addLayer(extentLayer);
	      var spatial = extentLayer.getBounds().toBBoxString()
	      self.model = spatial

	      // Reset map
	      self.showMap = false
	      L.Util.requestAnimFrame(map.invalidateSize, map, false, map._container);
	    });
	  }
	}
}
</script>