<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"  xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">

    <xsl:output method="xml" omit-xml-xsl:output method="xml" omit-xml-declaration="yes" indent="yes" version="1.0" encoding="ISO-8859-1"/>
    <xsl:strip-space elements="*"/>

    <xsl:template match="ss:Workbook">

        <xsl:for-each select="ss:Worksheet[@ss:Name='Planilha3']">

            <xsl:if test="count(ss:Table/ss:Row/ss:Cell/ss:Data) &gt; 0">

                <xsl:variable name="linhas">

                    <xsl:value-of select="string('[')" disable-output-escaping="yes"/>

                    <xsl:for-each select="ss:Table/ss:Row">

                        <xsl:if test="position()!=1">

                            <xsl:if test="./ss:Cell[1]/ss:Data != ''
                                and ./ss:Cell[2]/ss:Data != ''
                                and ./ss:Cell[3]/ss:Data != ''">

                                <xsl:variable name="colunas">

                                    <xsl:value-of select="string('&#xA;{&quot;nome-cliente&quot;:')" disable-output-escaping="yes"/>
                                    <xsl:value-of select="string('&quot;STOCKFARMA&quot;')"/>

                                    <xsl:value-of select="string(',&quot;codigo-cliente&quot;:')" disable-output-escaping="yes"/>
                                    <xsl:value-of select="4221"/>

                                    <xsl:value-of select="string(',&quot;codigo-descricao&quot;:')" disable-output-escaping="yes"/>
                                    <xsl:value-of select="concat('&quot;',./ss:Cell[1]/ss:Data,'&quot;')"/>

                                    <xsl:value-of select="string(',&quot;descricao-lupin&quot;:')" disable-output-escaping="yes"/>
                                    <xsl:value-of select="concat('&quot;',./ss:Cell[2]/ss:Data,'&quot;')"/>

                                    <xsl:value-of select="string(',&quot;ean&quot;:')" disable-output-escaping="yes"/>
                                    <xsl:value-of select="string(./ss:Cell[3]/ss:Data)"/>

                                    <xsl:value-of select="string('},')" disable-output-escaping="yes"/>

                                </xsl:variable>

                                <xsl:value-of select="string($colunas)"/>

                            </xsl:if>

                        </xsl:if>

                    </xsl:for-each>

                </xsl:variable>

                <xsl:value-of select="substring($linhas,0,string-length($linhas))"/>

            </xsl:if>

        </xsl:for-each>

        <xsl:value-of select="string('&#xA;]')" disable-output-escaping="no"/>

    </xsl:template>

</xsl:stylesheet>