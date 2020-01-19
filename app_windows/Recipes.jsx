import React, { Component } from 'react';
import { View, BackHandler } from "react-native";
import { Button, ThemeProvider, Input, Text, Card, Divider } from "react-native-elements";
import * as  Animatable from 'react-native-animatable';
import Recipe from "./Recipe";
import RecipeDetailed from "./RecipeDetailed";
import { ScrollView } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

class Recipes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxCalories: this.props.calories,
            mongodb: this.props.mongo,
            recipes: [],
            recipeNodes: [],
            selectedRecipe: null,
            transition: false
        }
    }

    componentDidMount() {
        this.state.mongodb.quieryForLTCals(this.state.maxCalories)
            .then(recipes => {
                let recipeNodes = recipes.map((recipe, i) => <Recipe state="fadeIn" onPress={this.onPress} recipe={recipe} delay={i * 250} key={i} />)
                let rec = recipes.map((recipe, i) => <Recipe state="fadeIn" onPress={this.onPress} recipe={recipe} delay={i * 250} key={(recipe._id)} />);
                let recs = recipes.map((recipe, i) => <Recipe state="fadeIn" onPress={this.onPress} recipe={recipe} delay={i * 250} key={(recipe._id + "s")} />);
                recipeNodes = rec.concat(recipeNodes).concat(recs)
                this.setState({ recipes, recipeNodes })
            })
    }





    scaleFade = {
        0: {
            opacity: 0,
        },
        0.2: {
            opacity: 1,
        }
    }

    setRef = ref => this.largePanel = ref;

    scaleCB = () => {
        this.setState({ transition: true })
    }



    onPress = id => {
        this.largePanel.fadeOutLeftBig();
        let selectedRecipe;
        let recipeNodes = this.state.recipes.map((recipe, i) => {
            if (recipe._id !== id) {
                return <Recipe state="fadeOut" onPress={this.onPress} recipe={recipe} key={i} />
            }
            else {
                selectedRecipe = recipe;
                return <Recipe state="scale" scaleCB={this.scaleCB} onPress={this.onPress} recipe={recipe} key={i} />
            }
        });

        this.setState({ recipeNodes, selectedRecipe });
    }

    addToList = () => {
        console.log("pressed");

        this.setState({ transition: false, recipeNodes: [] });
    }




    render() {
        let recipesPanel =
            <Animatable.View style={{ flex: 1 }}>
                <Animatable.View ref={this.setRef} style={{ backgroundColor: '#42a5f5', flex: 1, alignItems: "center", justifyContent: "center" }}>
                    <Animatable.View animation="fadeInDown" useNativeDriver >
                        <Text h3 style={{ color: "white", paddingTop: "5%" }} >Based on your preferences</Text>
                    </Animatable.View>
                </Animatable.View>
                <Animatable.View style={{ flex: 4, width: "80%", alignSelf: "center", top: "1%" }}>
                    <SafeAreaView>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            {this.state.recipeNodes}
                        </ScrollView>
                    </SafeAreaView>
                </Animatable.View>
            </Animatable.View>;

        let detailedRecipe =
            <Animatable.View useNativeDriver animation={this.scaleFade} style={{ flex: 1, alignItems: 'center' }}>
                <RecipeDetailed recipe={this.state.selectedRecipe} btnPressed={this.addToList} />
            </Animatable.View>

        return (
            <ThemeProvider>
                {this.state.transition ? detailedRecipe : recipesPanel}
            </ThemeProvider>
        );
    }
}

export default Recipes;