import React from 'react';
import { WebView } from 'react-native-webview';

interface Props {
  toolboxConfig: any;
  onCodeChange: (code: string) => void;
}

export default function BlocklyEditor({ toolboxConfig, onCodeChange }: Props) {
  const html = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://unpkg.com/blockly/blockly.min.js"></script>
        <style>
          /* ESTILOS CSS PARA PARECERSE A DUOLINGO */
          body { 
            margin: 0; 
            padding: 0; 
            background-color: #FFFFFF; 
            font-family: 'sans-serif';
          }
          #blocklyDiv { height: 100vh; width: 100vw; }

          /* Ocultar scrollbars y componentes feos */
          .blocklyFlyoutBackground {
            fill: #F7F7F7;
            fill-opacity: 1;
          }
          .blocklyPath {
            stroke-width: 0; /* Bloques sin bordes negros */
          }
          .blocklySvg {
            background-color: #FFFFFF; /* Fondo blanco limpio */
          }
          /* Bordes redondeados en la caja de herramientas */
          .blocklyFlyout {
            border-right: 2px solid #E5E5E5;
          }
          /* Esconder botones de zoom y basura */
          .blocklyZoom, .blocklyTrash { display: none; }
        </style>
      </head>
      <body>
        <div id="blocklyDiv"></div>
        <script>
          // TEMA ESTILO DUOLINGO
          const DuoTheme = Blockly.Theme.defineTheme('duo', {
            'base': Blockly.Themes.Classic,
            'blockStyles': {
              'logic_blocks': { 'colourPrimary': '#1CB0F6' }, // Azul
              'loop_blocks': { 'colourPrimary': '#FFB800' },  // Amarillo
              'math_blocks': { 'colourPrimary': '#58CC02' },  // Verde
              'variable_blocks': { 'colourPrimary': '#FF9600' } // Naranja
            },
            'componentStyles': {
              'workspaceBackgroundColour': '#FFFFFF',
              'toolboxBackgroundColour': '#F7F7F7',
              'toolboxForegroundColour': '#4B4B4B',
              'flyoutBackgroundColour': '#F7F7F7',
              'scrollbarColour': '#E5E5E5',
              'insertionMarkerColour': '#58CC02'
            }
          });

          const toolbox = {
            "kind": "flyoutToolbox",
            "contents": ${JSON.stringify(toolboxConfig)}
          };

          const workspace = Blockly.inject('blocklyDiv', {
            toolbox: toolbox,
            theme: DuoTheme,
            renderer: 'pxt', // Un renderizado más plano si está disponible
            move: {
              scrollbars: false,
              drag: true,
              wheel: false
            },
            zoom: { startScale: 1.4 } // Bloques más grandes para dedos
          });

          workspace.addChangeListener(() => {
            const code = Blockly.JavaScript.workspaceToCode(workspace);
            window.ReactNativeWebView.postMessage(code);
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      onMessage={(event) => onCodeChange(event.nativeEvent.data)}
      style={{ flex: 1 }}
      scrollEnabled={false} // Evita que la pantalla se mueva al arrastrar bloques
    />
  );
}