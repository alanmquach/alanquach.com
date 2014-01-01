# DocPad Configuration File
# http://docpad.org/docs/config

# Define the DocPad Configuration
docpadConfig = {
	templateData:
		# Specify some site properties
		site:
			# The production url of our website
			url: "http://alanquach.com"

			# The default title of our website
			title: "alanquach.com"

			# The website author's name
			author: "Alan Quach"

			# The website author's email
			email: "alanquach@me.com"


		# -----------------------------
		# Helper Functions

		# Get the prepared site/document title
		# Often we would like to specify particular formatting to our page's title
		# we can apply that formatting here
		getPreparedTitle: ->
			# if we have a document title, then we should use that and suffix the site's title onto it
			if @document.title
				"#{@document.title} | #{@site.title}"
				# if our document does not have it's own title, then we should just use the site's title
			else
				@site.title

	plugins:
		dateurls:
			cleanurl: true
			trailingSlashes: true
		cleanurls:
			trailingSlashes: true

}

# Export the DocPad Configuration
module.exports = docpadConfig