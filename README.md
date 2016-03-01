# d3-heatmap

Heatmap based on rectangular binning and gaussian blur.
 

## Demo

[Demo on blockbuilder](http://blockbuilder.org/fabid/0c4cf357ab5ed3e90382)

## API Reference

The **d3.heatmap** plugin implements **rectangular binning** followed by a **gaussian filter**, which is useful for aggregating data into a more coarse representation suitable for display even when data is sparse. Rather than displaying a scatterplot with tens of thousands of points, you can create a heatmap, and then display the distribution using color. The binning is inspired by and adapted from [earlier work by Fabio Nelli on 2d histograms](http://www.meccanismocomplesso.org/en/d3-histogram-2d-rectangular-binning/) while the gaussian blur algorithm is based on [Ivan Kuckir](http://blog.ivank.net/fastest-gaussian-blur.html)

<a name="heatmap" href="#heatmap">#</a> d3.<b>heatmap</b>()

Constructs a new default heatmap layout.

<a name="heatmap" href="#_heatmap">#</a> <b>heatmap</b>(<i>points</i>)

Evaluates the heatmap layout on the specified array of *points*, returning an array of rectangular *bins*. Each bin is an array containing the bin’s points, as well as some additional properties:

* x - the x-coordinate of the left side of the associated bin’s rectangle
* y - the y-coordinate of the top side of the associated bin’s rectangle
* v - the the value of the bin after gaussian filtering

Bins that are empty are not omitted. The origin bin at ⟨0,0⟩ is in the top-left.



<a name="x" href="#x">#</a> heatmap.<b>x</b>([<i>accessor</i>])

Sets or gets the *x*-accessor function for the heatmap layout. If *accessor* is specified, sets the *x*-accessor function and returns the heatmap layout; if *accessor* is not specified, returns the current *x*-accessor function, which defaults to `function(d) { return d[0]; }`.

<a name="y" href="#y">#</a> heatmap.<b>y</b>([<i>accessor</i>])

Sets or gets the *y*-accessor function for the heatmap layout. If *accessor* is specified, sets the *y*-accessor function and returns the heatmap layout; if *accessor* is not specified, returns the current *y*-accessor function, which defaults to `function(d) { return d[1]; }`.

<a href="dx" href="#dx">#</a> heatmap.<b>dx</b>([<i>dx</i>])

If *dx* is specified, sets the horizontal bin size to the specified value. If *dx* is not specified, returns the current value, which defaults to 0.1.

<a href="dy" href="#dy">#</a> heatmap.<b>dy</b>([<i>dy</i>])

If *dy* is specified, sets the vertical bin size to the specified value. If *dy* is not specified, returns the current value, which defaults to 0.1.

<a href="std" href="#std">#</a> heatmap.<b>std</b>([<i>std</i>])

If *std* is specified, sets the standard deviation of the gaussian blur (think radius) in number of bins to the specified value. If *std* is not specified, returns the current value, which defaults to 2.
