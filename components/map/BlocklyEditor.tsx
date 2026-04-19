import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { WebView } from 'react-native-webview';


interface Props {
  toolboxConfig: any;
  onCodeChange: (code: string) => void;
}

export default function BlocklyEditor({ toolboxConfig, onCodeChange }: Props) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <script src="https://unpkg.com/blockly/blockly.min.js"></script>
        <style>
          html, body { 
            margin: 0; padding: 0; width: 100%; height: 100%; 
            background-color: #ffffff; overflow: hidden; 
          }
          #blocklyDiv { width: 100vw; height: 100vh; }

          /* FONDO DE REJILLA (DOT GRID) */
          .blocklySvg {
            background-image: radial-gradient(#E5E5E5 1.5px, transparent 1.5px);
            background-size: 30px 30px;
            background-color: #ffffff;
          }

          /* ESTILO BANCO DE BLOQUES ABAJO */
          .blocklyFlyoutBackground {
            fill: #F7F7F7 !important;
            fill-opacity: 1;
            stroke: #E5E5E5;
            stroke-width: 2px;
          }

          /* BLOQUES ESTILO FLAT (SIN BORDES NEGROS) */
          .blocklyPath { stroke-width: 0; }

          /* OCULTAR ELEMENTOS INNECESARIOS */
          .blocklyScrollbarHorizontal, 
          .blocklyScrollbarVertical,
          .blocklyTrash, 
          .blocklyZoom { display: none !important; }
        </style>
      </head>
      <body>
        <div id="blocklyDiv"></div>
        <script>
          window.onload = function() {
            const DuoTheme = Blockly.Theme.defineTheme('duo', {
              'base': Blockly.Themes.Classic,
              'blockStyles': {
                'logic_blocks': { 'colourPrimary': '#1CB0F6' },
                'math_blocks': { 'colourPrimary': '#58CC02' },
                'variable_blocks': { 'colourPrimary': '#FF9600' }
              },
              'componentStyles': {
                'workspaceBackgroundColour': 'transparent',
                'toolboxBackgroundColour': '#F7F7F7',
              }
            });

            const workspace = Blockly.inject('blocklyDiv', {
              toolbox: { "kind": "flyoutToolbox", "contents": ${JSON.stringify(toolboxConfig)} },
              toolboxPosition: 'bottom',
              horizontalLayout: true,
              theme: DuoTheme,
              trashcan: false,
              zoom: { startScale: 1.2 }
            });

            workspace.addChangeListener(() => {
              const code = Blockly.JavaScript.workspaceToCode(workspace);
              window.ReactNativeWebView.postMessage(code);
            });
          };
        </script>
      </body>
    </html>
  `;

  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        onMessage={(event) => onCodeChange(event.nativeEvent.data)}
        javaScriptEnabled={true}
        style={{ flex: 1 }}
        scrollEnabled={false}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={{ position: 'absolute', height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
            <ActivityIndicator size="large" color="#58CC02" />
          </View>
        )}
      />
    </View>
  );
}