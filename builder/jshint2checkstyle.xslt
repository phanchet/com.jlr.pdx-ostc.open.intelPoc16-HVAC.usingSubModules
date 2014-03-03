<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="/jshint">
      <checkstyle>
        <xsl:apply-templates />
      </checkstyle>
    </xsl:template>

  <xsl:template match="file">
    <file>
      <xsl:attribute name="name">
        <xsl:value-of select="@name"/>
      </xsl:attribute>

      <xsl:apply-templates />
    </file>
  </xsl:template>

  <xsl:template match="issue">
    <error>
      <xsl:attribute name="line">
        <xsl:value-of select="@line"/>
      </xsl:attribute>
      <xsl:attribute name="column">
        <xsl:value-of select="@char"/>
      </xsl:attribute>
      <xsl:attribute name="severity">
        <xsl:text>warning</xsl:text>
      </xsl:attribute>
      <xsl:attribute name="message">
        <xsl:value-of select="@reason"/>
      </xsl:attribute>
      <xsl:attribute name="source">
        <xsl:text>com.philmander.jshint.JsHintAntTask</xsl:text>
      </xsl:attribute>
    </error>
  </xsl:template>
</xsl:stylesheet>
